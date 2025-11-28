<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no"/>
  <xsl:template match="/">
    <data>
      <users>
        <xsl:for-each select="//users/user">
          <user role="{@role}">
            <username><xsl:value-of select="username"/></username>
            <email><xsl:value-of select="email"/></email>
            <password><xsl:value-of select="password"/></password>
          </user>
        </xsl:for-each>
      </users>
    </data>
  </xsl:template>
</xsl:stylesheet>

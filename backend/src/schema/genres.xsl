<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no"/>
  <xsl:template match="/">
    <data>
      <genres>
        <xsl:for-each select="//library/genre">
          <genre id="{@id}">
            <label><xsl:value-of select="label"/></label>
            <description><xsl:value-of select="description"/></description>
            <icon><xsl:value-of select="icon"/></icon>
          </genre>
        </xsl:for-each>
      </genres>
    </data>
  </xsl:template>
</xsl:stylesheet>
